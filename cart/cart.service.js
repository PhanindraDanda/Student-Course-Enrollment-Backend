const db = require('../helpers/db');

module.exports = {
    getByUserID,
    InsertToCart,
    RemoveFromCart,
    UpdatePaymentStatus
};

async function getByUserID(id)
{
    let sql = "select * from student_enrollment.cart where user_id = ? and payment_status = 'UNPAID' and payment_reference IS NULL";
    return db.Query(sql, [id]);
}

async function InsertToCart(cartobj)
{
    console.log(cartobj);
    let sql = "insert into student_enrollment.cart (cart_reference,product_id,user_id,user_email) VALUES (?,?,?,?)";
    return db.Query(sql,[cartobj.cart_reference,cartobj.product,cartobj.user,cartobj.user_email]);
}

async function RemoveFromCart(cartobj)
{
   
    let sql = "delete from student_enrollment.cart where product_id = ? and user_id = ?";
    return db.Query(sql,[cartobj.product,cartobj.user]);
}

async function UpdatePaymentStatus(cartobj)
{
    let sql =`update student_enrollment.cart set payment_reference = ?, payment_status = ? WHERE user_email=? and payment_status = 'UNPAID' and payment_reference IS NULL `;
    return db.Query(sql, [cartobj.payment_intent,cartobj.payment_status,cartobj.customer_email]);
}