const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../Users/UserSchema");
const proModel = require("../Products/proSchema");
require("joi")
const CustomError = require("../Helper/customError");
const admin = require("../Authorizations/Authorization_admin");
const userOradmin = require("../Authorizations/Authorization_userOradmin");
const ownAccount = require("../Authorizations/Authorization_ownAccount");
const schema = require("../Authorizations/validate")
//--------------------------------------------------------------------------- sign up
router.post("/signup" ,async (req, res, next) => {
  try {
    const {
      FirstName,
      LastName,
      UserName,
      Password,
      PhoneNumber,
      Email,
      Address,
      Role,
    } = req.body;
    const { error } = schema.validate(req.body);
    if (error) {
    const errorMessage = `Validation error: ${error.details[0].message}`;
    return res.status(400).send(errorMessage);
    }
    const userexist = await UserModel.findOne({ UserName });
    if (userexist) {
      next(
        CustomError({
          stateCod: 401,
          message:"UserName is exist please use another one .",
        })
      );
    } else {
      const newUser = await UserModel.create({
        FirstName,
        LastName,
        UserName,
        Password,
        PhoneNumber,
        Email,
        Address,
        Role,
      });
      let token = await newUser.generateToken();
      if (!token) {
        next(
          CustomError({
            stateCod: 401,
            message: "Error in token",
          })
        );
      }
      res.status(200).send({ newUser, token });
    }
  } catch {
    next(
      CustomError({
        stateCod: 401,
        message: "Error in sign up API .",
      })
    );
  }
});
//--------------------------------------------------------------------------- login
router.post("/login", async (req, res, next) => {
  try {
    let { UserName, Password } = req.body;
    const FindUSer = await UserModel.findOne({ UserName });
    if (!FindUSer) {
      res.send("Invalid UserName , please signup first");
    }
    const passcompare = await bcrypt.compare(Password, FindUSer.Password);
    if (!passcompare) {
      next(
        CustomError({
          stateCod: 401,
          message: "Password Invalid",
        })
      );
    }
    let token = await FindUSer.generateToken();
    if (!token) {
      next(
        CustomError({
          stateCod: 401,
          message: "Error in token",
        })
      );
    }
    const products = await proModel.find();
    let Your_id = await FindUSer.id;
    res.status(200).send({ Your_id, products, token });
  } catch {
    next(
      CustomError({
        stateCod: 401,
        message: "Error in login API",
      })
    );
  }
});
//--------------------------------------------------------------------------- show all users
router.get("/showusers", admin, async (req, res, next) => {
  try {
    let allUsers = await UserModel.find();
    res.status(200).send(allUsers);
  } catch {
    next(
      CustomError({
        stateCod: 401,
        message: "Error in show users API",
      })
    );
  }
});
//--------------------------------------------------------------------------- edit user
router.patch("/edituser/:id", ownAccount, async (req, res, next) => {
  try {
    let { id } = req.params;
    let {
      FirstName,
      LastName,
      UserName,
      Password,
      PhoneNumber,
      Email,
      Address,
      Role,
    } = req.body;
    let editUser = await UserModel.findByIdAndUpdate(id, {
      FirstName,
      LastName,
      UserName,
      Password,
      PhoneNumber,
      Email,
      Address,
      Role,
    });
    let token = await editUser.generateToken();
    if (!token) {
      next(
        CustomError({
          stateCod: 401,
          message: "Error in token",
        })
      );
    }
    res.status(200).send(`Updated Successfully..... 
                          Your token : ${token}`);
  } catch {
    next(
      CustomError({
        stateCod: 401,
        message: "Error in edit user API",
      })
    );
  }
});
//--------------------------------------------------------------------------- delete user
router.delete("/deleteuser/:id", userOradmin, async (req, res, next) => {
  try {
    let { id } = req.params;
    const deluser = await UserModel.findOneAndDelete(id);
    res.status(200).send("deleted successfully");
  } catch {
    next(
      CustomError({
        stateCod: 401,
        message: "Error in delete user API",
      })
    );
  }
});

//--------------------------------------------------------------------------- fill the cart
router.patch("/fillcart/:id", ownAccount,async (req, res, next) => {
  try {
    let { id } = req.params;
    let Cart = req.body.Cart;
    let User = await UserModel.findByIdAndUpdate(id, {
      Cart,
    });
    const s = User.Cart;
    let x = User.Cart[0];
    var findproduct = await proModel.findOne({ ProductName: x });
    var price = 0;
    for (var i in User.Cart) {
      var z = User.Cart[i];
      var findproduct = await proModel.findOne({ ProductName: z });
      price = parseInt(price) + parseInt(findproduct.Price.toString());
    }
    res.send(`Your cart : ${s} 
              total your cart: ${price}
              --------------------------------------------
      1 - To verify the order add => /ok
      2 - To cancel the order add => /cancel`);
  } catch {
    next(
      CustomError({
        stateCod: 400,
        message: "Error in fill the cart API",
      })
    );
  }
});
//--------------------------------------------------------------------------- verify order
router.post("/fillcart/:id/ok", ownAccount, async (req, res, next) => {
  try {
    let { id } = req.params;
    let Cart = req.body.Cart;
    let User = await UserModel.findByIdAndUpdate(id, {
      Cart,
    });
    let x = User.Cart[0];
    var findproduct = await proModel.findOne({ ProductName: x });
    var price = 0;
    for (var i in User.Cart) {
      var z = User.Cart[i];
      var findproduct = await proModel.findOne({ ProductName: z });
      price = parseInt(price) + parseInt(findproduct.Price.toString());
    }
    const s = User.Cart;
    let j = await UserModel.findByIdAndUpdate(id, {
      Cart: [],
    });
    res.send(`******* You verified the order *******
            Your cart : ${s}
            Total Your Cart : ${price}
                **** Thanks for visiting our shop ****`);
  } catch {
    next(
      CustomError({
        stateCod: 400,
        message: "Error in verify order API",
      })
    );
  }
});
//--------------------------------------------------------------------------- cancel order
router.post("/fillcart/:id/cancel", ownAccount, async (req, res, next) => {
  try {
    let { id } = req.params;
    let Cart = [];
    let user = await UserModel.findByIdAndUpdate(id, {
      Cart,
    });
    res.send(`******* You canceled the order *******
                ***** Your cart has been emptied ***** 
                **** Thanks for visiting our shop ****`);
  } catch {
    next(
      CustomError({
        stateCod: 400,
        message: "Error in cancel order API",
      })
    );
  }
});
//---------------------------------------------------------------------------
module.exports = router;
//############################################################################################################
//------------------------------------------------ add user / edit user / sign up
// {
//     "FirstName":"moss",
//     "LastName":"moss",
//     "UserName":"am" ,
//     "Password":"123",
//     "PhoneNumber":"123",
//     "Email":"a@m",
//     "Address":"ismailia",
//     "Role":"admin"
//     //"Cart":["Orange","Meat","water"]
//   }
//------------------------------------------------ add product / edit product
// {
//     "ProductName": "water",
//     "Price": 150,
//     "Description": "This water is dry water"
// }
//------------------------------------------------ login
// {
//     "UserName":"am",
//     "Password":"123"
// }
//------------------------------------------------ fill the cart
// {
//     "Cart":["apple","milk"]
// }
