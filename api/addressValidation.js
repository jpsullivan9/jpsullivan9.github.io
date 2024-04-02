require("dotenv").config();
const EasyPost = require('@easypost/api');
const client = new EasyPost(process.env.EasyPost_SECRET_KEY);
/*
const addressParams = {
    verify: true,
    street1: '1353 Stelton Rd',
    city: 'Piscataway',
    state: 'NJ',
    zip: '08854',
    country: 'US',
    email: 'fourseasonsthai@gmail.com',
    phone: '+49 497 310 2759'
};
*/
module.exports = async (req, res) =>{
   const {street1, city, state, zip, country, email, phone} = req.query;
   const addressParams = {
    verify: true,
    street1: street1,
    city: city,
    state: state,
    zip: zip,
    country: country,
    email: email,
    phone: phone
   };

    if(street1 == undefined || city == undefined || state == undefined || zip == undefined || country == undefined){
    res.status(400).json({message : "not enough information"});
    }
    try{
        
        await client.Address.create(addressParams)
        .then(address => {
           // console.log(address);
            if (address.verifications && address.verifications.delivery && address.verifications.delivery.success) {
               isValidAddress= true;
              //console.log('Address verification success');
                res.status(200).json({message : 'address verified successfully'});
            } else {
               res.status(400).json*({message : 'address verification failed'});
                //console.log('Address verification failed');
            }
        })
        .catch(error => {
            res.status(400).json({message :  'error creating address', details : error.message});
            console.error('Error creating address:', error);
        });
    }
    catch(error) {
        res.status(500).json({message : "can't verify address"});
    }

};
