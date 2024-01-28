import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/signup", {
        username,
        password,
        firstName,
        lastName,
      });
      localStorage.setItem("token", response.data.token);
      const para = firstName.substring(0, 5);
      navigate("/dashboard?name=" + para, { state: { para } });
      // Handle the successful response
      console.log(response.data);
    } catch (error) {
      setSignupError(true);
      // Handle the error
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Rahul"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Kumar"
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => setUserName(e.target.value)}
            placeholder="rahul@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
          />
          {signupError && (
            <div className="text-red-500 mb-4">Error during signup. Please try again.</div>
          )}
          <div className="pt-4">
            <Button onClick={handleSignUp} label={"Sign up"} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
