import requireGlob from 'require-glob'
import { append, assoc, assocPath, reduce } from 'ramda'
import defaults from './swagger-defaults.json'
import { JsonSchemaManager, OpenApi3Strategy } from '@alt3/sequelize-to-json-schemas'
import { sequelize } from './src/shared/db'
import fs from 'fs'

const schemaManager = new JsonSchemaManager({
  absolutePaths: true,
  baseUri: '/',
  disableComments: true,
  secureSchemaUri: true
})
const strategy = new OpenApi3Strategy()

const createModels = reduce((allModels, [key, model]) => {
  const schema = schemaManager.generate(model, strategy)
  return assoc(key, schema, allModels)
}, {})

const routeDefinitions = requireGlob.sync('./src/modules/**/*.routes*', {
  reducer: (_opts: any, list: any, file: any) => append(file, list || [])
}).map(({ exports }) => exports.default)

const createPaths = reduce((allPaths, definitionFile) =>
  reduce((paths, [key, definition]) =>
    assocPath([definition.path, definition.method.toLowerCase()], ({
      operationId: key,
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          },
          description: 'Successful Response'
        },
        500: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          },
          description: 'Unsuccessful Response'
        }
      },
      security: definition.security?.map((sname: string) => ({
        [sname]: []
      }))
    }), paths)
  , allPaths, Object.entries(definitionFile))
, {})

const paths = createPaths(routeDefinitions)
const models = createModels(Object.entries(sequelize.models))

fs.writeFileSync('./api-docs/swagger.json', JSON.stringify({
  ...defaults,
  components: {
    ...defaults.components,
    schemas: {
      ...defaults.components.schemas,
      ...models
    }
  },
  paths
}, null, 2))
