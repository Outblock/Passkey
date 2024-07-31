import {
    Button,
    Card,
    CardBody,
    Divider,
  } from "@nextui-org/react";
  import { StoreContext } from "../../contexts";
  import { FaKey } from "react-icons/fa6";
  import { useEffect, useState, useContext } from "react";
  import Router from "next/router";

import { signOut } from "../../account";
  
  const ErrorCard = () => {
    const { store, setStore } = useContext(StoreContext);
  
    return (
      <div className="flex flex-col gap-4">
      <Card>
        <CardBody className="flex flex-col space-y-4 p-6">
          <div className="flex items-center gap-4">
            {/* <FaKey className="text-2xl" /> */}
            <h1 className="md:text-3xl text-lg  font-bold text-gray-300">{"Oops! 😬"}</h1>
          </div>
          <h1 className="text-1xl text-gray-500 pb-3">
            {"Sorry, it looks something is not working. Could you try again later ?"}
          </h1>
  
          <Button
            color="primary"
            variant="solid"
            onPress={async () => {
                setStore({});
                signOut();
                // Router.push('/');
                window.location.reload();
            }}
          >
            OK
          </Button>
        </CardBody>
      </Card>
      </div>
      
    );
  };
  
  export default ErrorCard;
  