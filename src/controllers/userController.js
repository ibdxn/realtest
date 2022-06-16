import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt"


export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {

    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation des not match",
        });
    }

    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken",
        });
    }

    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,

        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", { pageTitle: "Join", errorMessage: error._message, });

    };
};

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    };

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    console.log("LOG USER IN! COMING SOON!");
    // check if password correct  
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",

    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    return res.redirect(finalUrl)



};

export const finishGithubLogin = async (req, res) => {

    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,

    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            },

        })
    ).json();

    if ("access_token" in tokenRequest) {

        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,

                },

            })
        ).json();

        console.log(userData);

        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,

                },

            })

        ).json();

        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true

        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            await User.create({

                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");

    } else {
        return res.redirect("/login");
    };

};



export const logout = (req, res) => {

    req.session.destroy();
    return res.redirect("/")

};

export const getEdit = (req, res) => {

    return res.render("edit-profile", { pageTitle: "Edit Profile" });
}

export const postEdit = async (req, res) => {

    const {
        session: {
            user: { _id, email: sessionEmail, username: sessionUserName, },
        },
        body: { name, email, username, location } ,file,
    } = req; 



     if ( email != sessionEmail || username != sessionUserName ) {
        //console.log(sessionEmail);
        //console.log(email);

        //req.session.user.email = email;
        //req.session.user.username = username;

        if ( email === sessionEmail ) {

            const exists =  User.exists({
                _id: { $ne: { _id } },
                $or: [{ username }],
              });
        
            console.log(username);
            console.log(User.exists);
        //console.log(User.email);
        
       // const user = await User.findById(_id);
        //user.password = newPassword;
        if (exists) {
            return res.status(400).render("edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This username is already taken",
            });
        }
    
        else {

            const updatedUser = await User.findByIdAndUpdate(_id, {
                name,
                email,
                username,
                location,
            },file, { new: true });
    
            req.session.user = updatedUser;
            return res.redirect("/users/edit");
    
        }      
}

if ( username === sessionUserName ) {


    const exists =  User.exists({   //_id: { $ne: { _id } },
        $or: [ {email}  ] });

    //console.log(User.email);
    
    if (exists) {
        return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile",
            errorMessage: "This email is already taken",
        });
    }

    else {

        const updatedUser = await User.findByIdAndUpdate(_id, {
            name,
            email,
            username,
            location,
        },file, { new: true });

        req.session.user = updatedUser;
        return res.redirect("/users/edit");

    }      
}


    } else {

        const updatedUser = await User.findByIdAndUpdate(_id, {
            name,
            email,
            username,
            location,
        }, { new: true });

        req.session.user = updatedUser;
        return res.redirect("/users/edit");

    }

};


export const getChangePassword = (req, res) => {

    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password"});
 
};

export const postChangePassword = async (req, res) => {

    const {
        session: {
            user: { _id, password },
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;
    
    const ok = await bcrypt.compare(oldPassword, password);

    if(!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect",
        });
    }
    if (newPassword !== newPasswordConfirmation){

        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation",
        });
    }

    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;

    return res.redirect("/users/logout");

};


export const see = (req, res) => res.send("See User");

