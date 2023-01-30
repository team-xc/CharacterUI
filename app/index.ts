import { parseLayout } from '../util/layout'

const start = async () => {
  const [layout, ids] = await parseLayout('home')

  ids.get('time').setTextWithInterval(() => new Date().toLocaleTimeString(), 1000, true)

  layout.render()
}

const app = () => ({
  start
})

export default app()
