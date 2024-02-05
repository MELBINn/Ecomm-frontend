//for api calls
// import { userRequest } from "../requestMethods";
import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import axios from "axios";

const jsonString = localStorage.getItem("persist:root") ?? '{}';
const user = JSON.parse(JSON.parse(jsonString)?.user ?? '{}') ?? {};
const accessToken = user.currentUser?.accessToken ?? '';
const userId = user.currentUser?._id ?? '';


//login

export const login = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		console.log(user)
		const res = await axios.post("http://localhost:5000/api/auth/login", user,
			 {
				headers: {
					Authorization: `Bearer ${accessToken}`

				}
			}
		);
		dispatch(loginSuccess(res.data));
		console.log(res.data)
	} catch (err) {
		dispatch(loginFailure());
	}
}


//register

export const register = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		const { username, password } = user;
		await axios.post("http://localhost:5000/api/auth/register", user);
		const res2 = await axios.post("http://localhost:5000/api/auth/login", { username, password })
		dispatch(loginSuccess(res2.data));
	} catch (err) {
		dispatch(loginFailure());
	}
}


//addtocart

export const Cartitems = async (_id, quantity, color, size, price) => {
	try {
		// console.log(product)
		// if (!product || !product._id) {
		// 	console.error('Invalid product data:', product);
		// 	return;
		// }

		console.log(accessToken)


		const CartData = {
			products: [
				{
					productId: _id,
					size: size,
					color: color,
					quantity: quantity,
					price: price
				}
			]
		}

		console.log(CartData);

		const response = await axios.post("http://localhost:5000/api/cart", CartData,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			})

		if (response.status === 200) {
			console.log('Product added to cart successfully:', response.data);
		} else {
			console.error('Failed to add product to cart. Server returned:', response.status, response.data);
		}
	} catch (err) {
		console.error('An error occurred while adding the product to cart:', err);
	}
}




//update cart
export const updateCartitems = async (product) => {
	try {


		if (product.quantity === undefined) {
			console.error('Invalid product data:', product);
			return;
		}

		const id = product._id
		const quantity = product.quantity

		// console.log(id)
		const response = await axios.put(`http://localhost:5000/api/cart/${id}`, { quantity: quantity },
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
		console.log('Response:', response);
		if (response.status === 200) {
			console.log(' cart updated successfully:', response.data);
		} else {
			console.error('Failed to update product to cart. Server returned:', response.status, response.data);
		}
	} catch (error) {
		console.error('An error occurred while update the product of cart:', error);
	}
	// console.log("hii",userId)
}


//deletecart


export const Deletecartitems = async (req, res) => {
	try {
		const response = await axios.delete(`http://localhost:5000/api/cart/${userId}`,


			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
		if (response.status === 200) {
			console.log(' cart deleted successfully:', response.data);
		} else {
			console.error('Failed to delete product from the  cart. Server returned:', response.status, response.data);
		}
	}
	catch (error) {
		console.error('An error occurred while delete  the product from cart:', error);


	}
}