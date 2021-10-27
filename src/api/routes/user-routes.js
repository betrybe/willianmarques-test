const { Router } = require('express');

const userRouter = Router();

userRouter.post('/user', (req, res) => {
    res.send('teste');
});

export default userRouter;