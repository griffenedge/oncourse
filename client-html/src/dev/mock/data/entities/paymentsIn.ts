import { generateArraysOfRecords } from "../../mockUtils";
import { format } from "date-fns";

export function mockPaymentsIn() {
  this.getPaymentsIn = () => {
    return this.paymentsIn;
  };

  this.getPaymentIn = id => {
    const row = this.paymentsIn.rows.find(row => row.id == id);
    const site = this.getSite(row.id);

    return {
      id: row.id,
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
      accountInName: row.values[5],
      administrationCenterId: site.id,
      administrationCenterName: site.name,
      amount: row.values[4],
      ccSummary: [],
      ccTransaction: "1098103",
      chequeSummary: {},
      createdBy: "admin",
      dateBanked: null,
      datePayed: row.values[6],
      emailConfirmation: false,
      invoices: [
        { id: 1, dateDue: "2011-08-03", invoiceNumber: 31, amountOwing: 110.0, amount: 110.0 },
        { id: 2, dateDue: "2011-08-03", invoiceNumber: 32, amountOwing: 0.0, amount: -110.0 },
        { id: 3, dateDue: "2011-08-04", invoiceNumber: 53, amountOwing: 132.0, amount: 132.0 }
      ],
      payerId: 532,
      payerName: row.values[3],
      paymentInType: row.values[1],
      source: row.values[0],
      status: row.values[2]
    };
  };

  this.createPaymentIn = item => {
    const data = JSON.parse(item);
    const paymentsIn = this.paymentsIn;
    const totalRows = paymentsIn.rows;

    data.id = totalRows.length + 1;

    paymentsIn.rows.push({
      id: data.id,
      values: [
        data.source,
        data.paymentInType,
        data.status,
        data.payerName,
        data.amount,
        data.accountInName,
        data.datePayed
      ]
    });

    this.paymentsIn = paymentsIn;
  };

  this.removePaymentIn = id => {
    this.paymentsIn = this.paymentsIn.rows.filter(m => m.id !== id);
  };

  const rows = generateArraysOfRecords(20, [
    { name: "id", type: "number" },
    { name: "source", type: "string" },
    { name: "paymentInType", type: "string" },
    { name: "status", type: "string" },
    { name: "payerName", type: "string" },
    { name: "amount", type: "number" },
    { name: "accountInName", type: "number" },
    { name: "datePayed", type: "Datetime" }
  ]).map(l => ({
    id: l.id,
    values: [
      "office",
      "Credit card",
      "Success",
      l.payerName,
      l.amount * 100,
      "11100",
      format(new Date(l.datePayed), "yyyy-MM-dd")
    ]
  }));

  const columns = [
    {
      title: "Source",
      attribute: "source",
      type: null,
      sortable: true,
      visible: true,
      width: 200,
      sortFields: []
    },
    {
      title: "Type",
      attribute: "paymentMethod.name",
      type: null,
      sortable: true,
      visible: true,
      width: 200,
      sortFields: []
    },
    {
      title: "Status",
      attribute: "statusString",
      type: null,
      sortable: true,
      visible: true,
      width: 200,
      sortFields: ["status"]
    },
    {
      title: "Name",
      attribute: "payer.fullName",
      type: null,
      sortable: true,
      visible: true,
      width: 200,
      sortFields: ["payer.lastName", "payer.firstName", "payer.middleName"]
    },
    {
      title: "Amount",
      attribute: "amount",
      type: "Money",
      sortable: true,
      visible: true,
      width: 200,
      sortFields: []
    },
    {
      title: "Account",
      attribute: "accountIn.accountCode",
      type: null,
      sortable: true,
      visible: true,
      width: 200,
      sortFields: []
    },
    {
      title: "Date paid",
      attribute: "paymentDate",
      type: "Datetime",
      sortable: true,
      visible: true,
      width: 200,
      sortFields: []
    }
  ];

  const response = { rows, columns } as any;

  response.entity = "PaymentIn";
  response.offset = 0;
  response.filterColumnWidth = 200;
  response.layout = "Three column";
  response.pageSize = 20;
  response.search = null;
  response.count = rows.length;
  response.sort = [
    {
      attribute: "source",
      ascending: true,
      complexAttribute: []
    }
  ];

  return response;
}