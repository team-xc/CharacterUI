import { BaseView } from '../view/BaseView'
import Home from './module/home'

const start = () => {
  const view = new BaseView({
    width: 50,
    height: 6
  })
  view.loadView(Home)
  view.render()
}

const app = () => ({
  start
})

export default app()
