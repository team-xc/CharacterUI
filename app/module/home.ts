import { TextView } from '../../view/TextView'
import { BaseView } from '../../view/BaseView'
import { EditText } from '../../view/EditText'

const Home = (container: BaseView) => {
  const tv1 = new TextView({text: new Date().toLocaleTimeString(), border: false, horizontalPadding: 1, color: 32})
  setInterval(() => {tv1.setText(new Date().toLocaleTimeString())}, 1000)
  container.add(tv1, 36, 0)

  const et1 = new EditText({text: '', hint: 'Please enter your name', border: true, horizontalPadding: 1})
  container.add(et1, 1, 0)
}

export default Home