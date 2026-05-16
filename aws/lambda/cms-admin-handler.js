const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, DeleteCommand, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb")

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}))

const collectionConfig = {
  team: { id: "team-members", kind: "member" },
  roles: { id: "recruitment-roles", kind: "role" },
  partners: { id: "partners", kind: "partner" },
  assets: { id: "media-assets", kind: "asset" },
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }
}

function itemType(kind, slug, status) {
  return `${kind}#${slug}#${status}`
}

async function list(collection, status) {
  const config = collectionConfig[collection]
  if (!config) {
    return response(404, { error: "Unknown CMS collection" })
  }

  const result = await dynamo.send(new QueryCommand({
    TableName: process.env.CMS_TABLE_NAME,
    KeyConditionExpression: "#id = :id and begins_with(#type, :prefix)",
    ExpressionAttributeNames: { "#id": "id", "#type": "type" },
    ExpressionAttributeValues: { ":id": config.id, ":prefix": `${config.kind}#` },
  }))

  const items = (result.Items || [])
    .filter((item) => String(item.type || "").endsWith(`#${status}`))
    .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0))

  return response(200, { items })
}

async function saveDraft(collection, slug, body) {
  const config = collectionConfig[collection]
  if (!config || collection === "assets") {
    return response(404, { error: "Unknown mutable CMS collection" })
  }

  const item = {
    ...body,
    id: config.id,
    type: itemType(config.kind, slug, "draft"),
    slug,
    status: "draft",
    updatedAt: body.updatedAt || new Date().toISOString(),
  }

  await dynamo.send(new PutCommand({ TableName: process.env.CMS_TABLE_NAME, Item: item }))
  return response(200, { item })
}

async function publish(collection, slug, updatedBy) {
  const config = collectionConfig[collection]
  if (!config || collection === "assets") {
    return response(404, { error: "Unknown mutable CMS collection" })
  }

  const draftResult = await dynamo.send(new QueryCommand({
    TableName: process.env.CMS_TABLE_NAME,
    KeyConditionExpression: "#id = :id and #type = :type",
    ExpressionAttributeNames: { "#id": "id", "#type": "type" },
    ExpressionAttributeValues: { ":id": config.id, ":type": itemType(config.kind, slug, "draft") },
  }))
  const draft = draftResult.Items && draftResult.Items[0]

  if (!draft) {
    return response(404, { error: "Draft not found" })
  }

  const item = {
    ...draft,
    type: itemType(config.kind, slug, "published"),
    status: "published",
    updatedAt: new Date().toISOString(),
    updatedBy,
  }

  await dynamo.send(new PutCommand({ TableName: process.env.CMS_TABLE_NAME, Item: item }))
  return response(200, { item })
}

async function remove(collection, slug, status) {
  const config = collectionConfig[collection]
  if (!config || collection === "assets") {
    return response(404, { error: "Unknown mutable CMS collection" })
  }

  if (!status || (status !== "draft" && status !== "published")) {
    return response(400, { error: "Invalid status" })
  }

  await dynamo.send(new DeleteCommand({
    TableName: process.env.CMS_TABLE_NAME,
    Key: {
      id: config.id,
      type: itemType(config.kind, slug, status),
    },
  }))

  return response(200, { ok: true })
}

exports.handler = async (event) => {
  const method = event.httpMethod || event.requestContext?.http?.method || "GET"
  const path = event.path || event.rawPath || ""
  const body = event.body ? JSON.parse(event.body) : {}
  const parts = path.split("/").filter(Boolean)

  if (method === "GET" && parts[0] === "cms" && parts[1] === "public") {
    return list(parts[2], "published")
  }

  if (method === "GET" && parts[0] === "cms" && parts[1] === "admin") {
    return list(parts[2], event.queryStringParameters?.status || "draft")
  }

  if (method === "PUT" && parts[0] === "cms" && parts[1] === "admin" && parts[4] === "draft") {
    return saveDraft(parts[2], parts[3], body)
  }

  if (method === "POST" && parts[0] === "cms" && parts[1] === "admin" && parts[4] === "publish") {
    return publish(parts[2], parts[3], body.updatedBy)
  }

  if (method === "DELETE" && parts[0] === "cms" && parts[1] === "admin" && (parts[4] === "draft" || parts[4] === "published")) {
    return remove(parts[2], parts[3], parts[4])
  }

  return response(404, { error: "Not found" })
}
