const getFunction = (functionName: string) => {
  if (functionName.includes("createPayment")) {
    return "createPayment";
  }

  if (functionName.includes("updatePayment")) {
    return "updatePayment";
  }

  if (functionName.includes("getPayment")) {
    return "getPayment";
  }

  if (functionName.includes("listPayments")) {
    return "listPayments";
  }

  if (functionName.includes("deletePayment")) {
    return "deletePayment";
  }

  return "";
};

export default getFunction;
