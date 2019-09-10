import ShopOrders from "./order/ShopOrders"
import { Route, Switch } from "react-router-dom"
import Users from "./user/Users"
import Signin from "./auth/Signin"
import Profile from "./user/Profile"
import PrivateRoute from "./auth/PrivateRoute"
import NewShop from "./shop/NewShop"
import MyShops from "./shop/MyShops"
import EditShop from "./shop/EditShop"
import EditProduct from "./product/EditProduct"
import Cart from "./cart/Cart"
import StripeConnect from "./user/StripeConnect"
import Order from "./order/Order"

class MainRouter extends Component {
  // Removes the server-side injected CSS when React component mounts
  componentDidMount() {
    const jssStyles = document.getElementById("jss-server-side")
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    return (
      <div>
        <Menu />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <Route path="/user/:userId" component={Profile} />

          <Route path="/cart" component={Cart} />
          <Route path="/product/:productId" component={Product} />
          <Route path="/shops/all" component={Shops} />
          <Route path="/shops/:shopId" component={Shop} />

          <Route path="/order/:orderId" component={Order} />
          <PrivateRoute
            path="/seller/orders/:shop/:shopId"
            component={ShopOrders}
          />

          <PrivateRoute path="/seller/shops" component={MyShops} />
          <PrivateRoute path="/seller/shop/new" component={NewShop} />
          <PrivateRoute path="/seller/shop/edit/:shopId" component={EditShop} />
          <PrivateRoute
            path="/seller/:shopId/products/new"
            component={NewProduct}
          />
          <PrivateRoute
            path="/seller/:shopId/:productId/edit"
            component={EditProduct}
          />

          <Route path="/seller/stripe/connect" component={StripeConnect} />
        </Switch>
      </div>
    )
  }
}

export default MainRouter
