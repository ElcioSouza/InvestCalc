import { handleRoute } from '@server/utils/handleRoute'
import { CalculateController } from '@server/controllers/calculateController'

export const GET    = handleRoute((req) => CalculateController.execute(req))
export const POST   = handleRoute((req) => CalculateController.execute(req))
export const PUT    = handleRoute((req) => CalculateController.execute(req))
export const DELETE = handleRoute((req) => CalculateController.execute(req))
