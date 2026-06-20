import { handleRoute } from '@server/utils/handleRoute'
import { CalculateController } from '@server/controllers/calculateController'

export const GET = handleRoute((req) => CalculateController.execute(req))
