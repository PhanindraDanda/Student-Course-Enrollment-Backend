const auth = require('../helpers/firebase.service');
const db = require('../helpers/db');

module.exports = {
    getUser,
    getCourses
};

async function getUser(uid)
{
    return new Promise(async (resolve, reject) =>{

        await auth.getUser(uid)
        .then(data=>{
            resolve(data);
        })
        .catch(err=>{
            reject(err);
        })
    })
}

async function getCourses(idToken)
{
    let sql = "select * from student_enrollment.cart where user_id = ? and payment_status = 'PAID' and payment_reference IS NOT NULL";
    return db.Query(sql,[idToken]);

}