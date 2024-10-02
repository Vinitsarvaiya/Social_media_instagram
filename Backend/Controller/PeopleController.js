const { People, User } = require('../models')

const Followingrequest = async (req, res) => {
    const { id: receiver_id } = req.body //recevier user
    const { id: sender_id } = req.user // current user
    console.log("hello", "sender", sender_id, "reciver", receiver_id)
    if (receiver_id === sender_id) { return res.send({ message: "you cannot send request to yout self" }) }

    const finduser = await User.findOne({ where: { id: req.body.id } })
    if (!finduser) { return res.send({ message: "user does not exist" }) }


    const isRequested = await People.findOne({ where: { sender_id: sender_id, receiver_id: receiver_id } })
    if (isRequested) { return res.send({ message: "request already sended" }) }

    if (!isRequested && receiver_id !== sender_id) {
        const people = await People.create({ status: "pending", sender_id: sender_id, receiver_id: receiver_id })
        if (people != null) { return res.send({ message: "following reuqest send successfully" }) }
    }
}


const AcceptedRequest = async (req, res) => {
    const { id: sender_id } = req.body //reuest sender
    const { id: receiver_id } = req.user  // current user

    const finduser = await User.findOne({ where: { id: req.body.id } })
    if (!finduser) { return res.send({ message: "user does not exist" }) }

    const isRequested = await People.findOne({ where: { sender_id: sender_id, receiver_id: receiver_id, status: "pending" } })
    if (!isRequested) { return res.send({ message: "user does not ave request" }) }

    if (isRequested) {
        const people = await People.findOne({ where: { status: "pending", sender_id: sender_id, receiver_id: receiver_id } })
        if (people) {
            people.status = "accepted"
            people.save()
            return res.send({ message: "following reuqest accepted successfully" })
        }
    }
}

const RejectedRequest = async (req, res) => {
    const { id: sender_id } = req.body //reuest sender
    const { id: receiver_id } = req.user  // current user

    const finduser = await User.findOne({ where: { id: req.body.id } })
    if (!finduser) { return res.send({ message: "user does not exist" }) }

    const isRequested = await People.findOne({ where: { sender_id: sender_id, receiver_id: receiver_id } })
    if (!isRequested) { return res.send({ message: "user does not ave request" }) }

    if (isRequested) {
        const people = await People.findOne({ where: { sender_id: sender_id, receiver_id: receiver_id } })
        if (people) {
            await People.destroy({
                where: {
                    sender_id: sender_id, receiver_id: receiver_id
                },
              })
        }
    return res.send({ message: "following reuqest rejected successfully" })
    }
}


const unfollowRequest = async (req, res) => {
    const { id: receiver_id } = req.body //reuest sender
    const { id: sender_id } = req.user  // current user 

    const finduser = await User.findOne({ where: { id: req.body.id } })
    if (!finduser) { return res.send({ message: "user does not exist" }) }

    const isRequested = await People.findOne({ where: { sender_id: sender_id, receiver_id: receiver_id } })
    if (!isRequested) { return res.send({ message: "user does not ave request" }) }

    if (isRequested) {
        const people = await People.findOne({ where: { sender_id: sender_id, receiver_id: receiver_id } })
        if (people) {
            await People.destroy({
                where: {
                    sender_id: sender_id, receiver_id: receiver_id
                },
              })
        }
    return res.send({ message: "following reuqest rejected successfully" })
    }
}


module.exports = {
    Followingrequest,
    AcceptedRequest,
    RejectedRequest,
    unfollowRequest
}