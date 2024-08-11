"use client";
import React from "react";
import AuthForm from "@/components/AuthForm";
import { updatePassword } from "@/app/auth/action";

const UpdatePassword = () => {
  return (
    <AuthForm
      type="updatePassword"
      onSubmit={async ({ password }) => {
        return await updatePassword(password!);
      }}
    />
  );
};

export default UpdatePassword;
