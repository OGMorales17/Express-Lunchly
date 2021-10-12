/** Routes for Lunchly */

const express = require("express");

const Customer = require("./models/customer");
const Reservation = require("./models/reservation");

const router = new express.Router();

// Futher Study
/** Create a new homepage that will have a empty page, add the empty page route to Lunch.ly
 * and the current route to Customers link in the navbar. */

/** Homepage: show list of customers. */

router.get("/", async (req, res, next) => {
  return res.render("customer_search.html");
});

router.get("/customers", async (req, res, next) => {
  try {
    const customers = await Customer.all();
    return res.render("customer_list.html", { customers });
  } catch (err) {
    return next(err);
  }
});

/** Search Page: show list of customers by search. */

// router.get("/search/", async function (req, res, next) {
//   try {
//     const customers = await Customer.search(req.query.term);
//     return res.render("customer_search.html", { customers, fullName: req.query.fullName });
//   } catch (err) {
//     return next(err);
//   }
// });


router.get('/search', async function (req, res, next) {
  try {
    console.log("What is req.query?", req.query);
    const fullName = req.query.fullName.split(" ");
    const customers = await Customer.getByName(fullName[0], fullName[1]);
    console.log(customers)
    return res.render('customer_search.html', { customers });
  } catch (err) {
    return next(err);
  }
});


/** Best Customers Page: show list of top 10 customers  who makes most reservations. */

router.get('/top-ten', async function (req, res, next) {
  try {
    const customers = await Customer.getTopTen();
    return res.render('top_10_customers.html', { customers });
  } catch (err) {
    return next(err);
  }
});

/** Form to add a new customer. */

router.get("/add/", async function (req, res, next) {
  try {
    return res.render("customer_new_form.html");
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new customer. */

router.post("/add/", async function (req, res, next) {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const notes = req.body.notes;

    const customer = new Customer({ firstName, lastName, phone, notes });
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Show a customer, given their ID. */

router.get("/:id/", async function (req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);

    const reservations = await customer.getReservations();

    return res.render("customer_detail.html", { customer, reservations });
  } catch (err) {
    return next(err);
  }
});

/** Show form to edit a customer. */

router.get("/:id/edit/", async function (req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);

    res.render("customer_edit_form.html", { customer });
  } catch (err) {
    return next(err);
  }
});

/** Handle editing a customer. */

router.post("/:id/edit/", async function (req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.phone = req.body.phone;
    customer.notes = req.body.notes;
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new reservation. */

router.post("/:id/add-reservation/", async function (req, res, next) {
  try {
    const customerId = req.params.id;
    const startAt = new Date(req.body.startAt);
    const numGuests = req.body.numGuests;
    const notes = req.body.notes;

    const reservation = new Reservation({
      customerId,
      startAt,
      numGuests,
      notes
    });
    await reservation.save();

    return res.redirect(`/${customerId}/`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
