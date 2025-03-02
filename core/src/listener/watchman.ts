import express, { Request, Response } from 'express'
import { Logger } from 'pino'
import { State } from './state'
import { LISTENER_PORT } from '../settings'

export async function watchman({
  listenFn,
  state,
  logger
}: {
  listenFn
  state: State
  logger?: Logger
}) {
  const app = express()

  /**
   * List all listeners.
   */
  app.get('/all', async (req: Request, res: Response) => {
    logger?.debug('/all')

    try {
      const all = await state.all()
      res.status(200).send(all)
    } catch (e) {
      logger?.error(e)
      res.status(500).send(e)
    }
  })

  /**
   * List active listeners.
   */
  app.get('/active', async (req: Request, res: Response) => {
    logger?.debug('/active')

    try {
      const active = await state.active()
      res.status(200).send(active)
    } catch (e) {
      logger?.error(e)
      res.status(500).send(e)
    }
  })

  /**
   * Launch new listener.
   */
  app.get('/activate/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    logger?.debug(`/activate/${id}`)

    try {
      const listener = await state.add(id)
      const intervalId = await listenFn(listener)
      await state.update(listener.id, intervalId)

      const message = `Listener with ID=${id} started`
      logger?.debug(message)
      res.status(200).send({ message })
    } catch (e) {
      logger?.error(e.message)
      res.status(500).send({ message: e.message })
    }
  })

  /**
   * Stop a specific listener.
   */
  app.get('/deactivate/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    logger?.debug(`/deactivate/${id}`)

    try {
      await state.remove(id)

      const message = `Listener with ID=${id} stopped`
      logger?.debug(message)
      res.status(200).send({ message })
    } catch (e) {
      logger?.error(e.message)
      res.status(500).send({ message: e.message })
    }
  })

  /**
   * Report on health of listener service.
   */
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('ok')
  })

  return app.listen(LISTENER_PORT)
}
