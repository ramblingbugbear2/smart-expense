const QRCode = require('qrcode');

/** build({payeeVpa, payeeName, amount, txnNote}) → { intent, qrPng } */
exports.build = async ({ payeeVpa, payeeName, amount, txnNote }) => {
  const intent = new URL('upi://pay');
  intent.searchParams.set('pa', payeeVpa);
  intent.searchParams.set('pn', payeeName);
  intent.searchParams.set('am', amount.toFixed(2));
  intent.searchParams.set('cu', 'INR');
  if (txnNote) intent.searchParams.set('tn', txnNote);

  const url = intent.toString();
  const qr  = await QRCode.toDataURL(url, { margin: 1, width: 240 });
  return { intent: url, qrPng: qr };
};
