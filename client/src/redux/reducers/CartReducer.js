let cartState = [];

export const cartReducer = (state = cartState, action) => {
  switch (action.type) {
    case "add_to_cart": {
      cartState = [{ ...action.value }];
      return cartState;
    }
    case "load_cart": {
      cartState = action.value;
      return [...cartState];
    }
    default: {
      return state;
    }
  }
};

export default cartReducer;

//  {
//         "fish_id": 1,
//         "fish_name": "Cá Betta Halfmoon",
//         "user_id": 1,
//         "size_id": 2,
//         "price": "35000",
//         "amount": "1",
//         "size_name": "3cm",
//         "url_image": "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/betta-halfmoon.jpg"
//     },
