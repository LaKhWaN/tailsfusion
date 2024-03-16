import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import illustration from "images/signup-illustration.svg";
import logo from "images/logo.svg";
import axios from "axios";

const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

const SignUpForm = ({
  logoLinkUrl = "/",
  illustrationImageSrc = illustration,
  submitButtonText = "Sign Up & Pay",
  tosUrl = "#",
  privacyPolicyUrl = "#",
  signInUrl = "/components/innerPages/LoginPage",
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    businessName: "",
    totalEmployees: "",
  });

  const [errorMsg, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:3001/api/signup", formData)
        .then((res) => {
          if (res.data.error) {
            setError(res.data.error);
            return;
          } else {
            console.log("Signup successful!");
            localStorage.setItem("username", formData.username);
            localStorage.setItem("auth", true);
            // redirect to /
            window.location.href = "/";
          }
        });
    } catch (error) {
      // console.log("HERE")
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>Sign Up For TailsFusion - Business Plan</Heading>
              <FormContainer>
                <Form onSubmit={handleSubmit}>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Tails Username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Tails Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Input
                    name="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  <Input
                    name="totalEmployees"
                    type="text"
                    placeholder="Total Employees (10-20 employees)"
                    value={formData.totalEmployees}
                    onChange={handleChange}
                  />
                  <p style={{ color: "red" }}>{errorMsg}</p>
                  <SubmitButton type="submit">{submitButtonText}</SubmitButton>
                  {/* <p>
                    I agree to abide by TailsFusion's{" "}
                    <a href={tosUrl}>Terms of Service</a> and its{" "}
                    <a href={privacyPolicyUrl}>Privacy Policy</a>
                  </p>
                  <p>
                    Already have an account? <a href={signInUrl}>Sign In</a>
                  </p> */}
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default SignUpForm;
