const {User} = require('../../database');
const { userLogin, userwithPass, userUpdPass, userUpdSub}= require('../../Controllers/Users/userLogin')

const validateUser = async (req, res) => {
  const { email, password, nickname, given_name, picture, sub } = req.body;
  try {
    const userFound = await User.findOne({
      attributes: ['sub', 'password', 'deleteAt'],
      where: {
        email: email,
      },
    });

    if (!userFound) {
      if (sub !== null && password === null) {
        const send = await userLogin(email, password, nickname, given_name, picture, sub);
        return res.status(201).json(send);

      } else if (sub === null && password !== null) {
        const send = await userwithPass(email, password, nickname, given_name, picture, sub);
        return res.status(201).json(send);

      } else {
        return res.status(400).json({ error: 'Invalid request parameters create' });
      }
    } if (userFound && userFound.deleteAt === true){
      return res.status(401).json({ error: 'Este email no esta disponible' }); 
    }if (userFound && userFound.deleteAt === false){
      if (sub !== null && password === null) {
        if (userFound.sub && !userFound.password) {
          const send1 = await userLogin(email, password, nickname, given_name, picture, sub);
          return res.status(200).json(send1);

        } else if (userFound.sub && userFound.password){
          const send1 = await userLogin(email, password, nickname, given_name, picture, sub);
          return res.status(200).json(send1);
        }
          else if(!userFound.sub && userFound.password){
            const result = await userUpdSub(email, password, nickname, given_name, picture, sub, req, res)
            return res.status(200).json(result);
          
        }else {
          return res.status(400).json({ error: 'Invalid request parameters login' });
        }

      }if (sub === null && password !== null) {
        if (userFound.sub && !userFound.password){
          const send3 = await userUpdPass(email, password, nickname, given_name, picture, sub, req, res);
          return res.status(200).json(send3);

        } else if(!userFound.sub && userFound.password){
          const result = await userwithPass(email, password, nickname, given_name, picture, sub, req, res);
          return res.status(200).json(result);

        }else if (userFound.sub && userFound.password){
          const result = await userwithPass(email, password, nickname, given_name, picture, sub, req, res);
          return res.status(200).json(result);
        }
      } else {
        return res.status(400).json({ error: 'Invalid request parameters password' });
      }
    }
  } catch (error) {
    console.error("¡Hubo un error (en la funcion validate)!", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = validateUser;
