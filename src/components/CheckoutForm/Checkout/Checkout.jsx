import React, { useState, useEffect } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@material-ui/core";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";

import useStyles from "./styles";
import { commerce } from "../../../lib/commerce";

const steps = ["Shipping address", "Payment details"];

const Checkout = ({ cart }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setcheckoutToken] = useState({});

  const classes = useStyles();
  let lastStep = false;

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });

        console.log("**Token**", token);

        setcheckoutToken(token);
      } catch (error) {}
    };

    generateToken();
  }, [cart]);

  const Confirmation = () => <div>Confirmation</div>;
  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} />
    ) : (
      <PaymentForm />
    );

  return (
    <>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography className={classes.title} align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel className={classes.label}>{step}</StepLabel>
                {
                  ((lastStep = !lastStep),
                  lastStep && <div className={classes.verticalLine}></div>)
                }
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : cart && <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
