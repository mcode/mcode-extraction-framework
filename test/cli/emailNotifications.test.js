const nodemailer = require('nodemailer');
const { sendEmailNotification } = require('../../src/cli/emailNotifications');

const createTransportSpy = jest.spyOn(nodemailer, 'createTransport');

describe('sendEmailNotification', () => {
  const sendMailMock = jest.fn();
  beforeEach(() => {
    sendMailMock.mockClear();
    createTransportSpy.mockClear();
  });

  it('should not send an email if there are no errors for any patient', async () => {
    const notificationInfo = {};
    const errors = {
      0: [],
      1: [],
      2: [],
    };

    await expect(sendEmailNotification(notificationInfo, errors, false)).resolves.not.toThrow();
    expect(createTransportSpy).not.toBeCalled();
    expect(sendMailMock).not.toBeCalled();
  });

  it('should throw an error when missing required notification options', async () => {
    const invalidNotificationInfo = {
      host: 'my.host.com',
    };
    const errors = {
      0: [],
      1: [{ message: 'something bad' }],
      2: [{ message: 'an error' }, { message: 'another error' }],
    };

    const errorMessage = 'Email notification information incomplete. Unable to send email with 3 errors.';
    await expect(sendEmailNotification(invalidNotificationInfo, errors, false)).rejects.toThrowError(errorMessage);
    expect(createTransportSpy).not.toBeCalled();
    expect(sendMailMock).not.toBeCalled();
  });

  it('should send an email according to minimal config options with errors in the body', async () => {
    createTransportSpy.mockReturnValueOnce({ sendMail: sendMailMock });
    const notificationInfo = {
      host: 'my.host.com',
      to: ['something@example.com', 'someone@example.com'],
    };
    const errors = {
      0: [],
      1: [{ message: 'something bad' }],
      2: [{ message: 'an error' }, { message: 'another error' }],
    };

    await expect(sendEmailNotification(notificationInfo, errors, false)).resolves.not.toThrow();
    expect(createTransportSpy).toBeCalledWith({ host: notificationInfo.host });
    expect(sendMailMock).toBeCalled();
    const sendMailMockArgs = sendMailMock.mock.calls[0][0];
    expect(sendMailMockArgs.to).toEqual(notificationInfo.to);
    expect(sendMailMockArgs.from).toEqual('mCODE Extraction Errors mcode-extraction-errors@mitre.org');
    expect(sendMailMockArgs.subject).toEqual('mCODE Extraction Client Errors');
    expect(sendMailMockArgs.text).toMatch(/This is an automated email/i);
    expect(sendMailMockArgs.text).toMatch(/something bad/i);
    expect(sendMailMockArgs.text).toMatch(/another error/i);
    expect(sendMailMockArgs.text).toMatch(/run the extraction client using the `--debug`/i);
  });

  it('should send an email according to maximal config options with errors in the body', async () => {
    createTransportSpy.mockReturnValueOnce({ sendMail: sendMailMock });
    const notificationInfo = {
      host: 'my.host.com',
      port: 123,
      to: ['something@example.com', 'someone@example.com'],
      from: 'other@example.com',
      tlsRejectUnauthorized: false,
    };
    const errors = {
      0: [],
      1: [{ message: 'something bad', stack: 'Error at line 1' }],
      2: [{ message: 'an error', stack: 'Error at line 3' }, { message: 'another error', stack: 'Error at line 4' }],
    };

    await expect(sendEmailNotification(notificationInfo, errors, false)).resolves.not.toThrow();
    expect(createTransportSpy).toBeCalledWith({ host: notificationInfo.host, port: notificationInfo.port, tls: { rejectUnauthorized: notificationInfo.tlsRejectUnauthorized } });
    expect(sendMailMock).toBeCalled();
    const sendMailMockArgs = sendMailMock.mock.calls[0][0];
    expect(sendMailMockArgs.to).toEqual(notificationInfo.to);
    expect(sendMailMockArgs.from).toEqual(notificationInfo.from);
    expect(sendMailMockArgs.subject).toEqual('mCODE Extraction Client Errors');
    expect(sendMailMockArgs.text).not.toMatch(/This is an automated email/i);
    expect(sendMailMockArgs.text).toMatch(/something bad/i);
    expect(sendMailMockArgs.text).toMatch(/another error/i);
    expect(sendMailMockArgs.text).toMatch(/run the extraction client using the `--debug`/i);
    expect(sendMailMockArgs.text).not.toMatch(/Error at line 1`/i);
    expect(sendMailMockArgs.text).not.toMatch(/Error at line 4`/i);
  });

  it('should send an email with tlsRejectUnauthorized set to true, false, and not set', async () => {
    const notificationInfoTLSFalse = {
      host: 'my.host.com',
      to: ['something@example.com', 'someone@example.com'],
      tlsRejectUnauthorized: false,
    };
    const notificationInfoTLSTrue = {
      host: 'my.host.com',
      to: ['something@example.com', 'someone@example.com'],
      tlsRejectUnauthorized: true,
    };
    const notificationInfoNoTLS = {
      host: 'my.host.com',
      to: ['something@example.com', 'someone@example.com'],
    };
    const notificationInfoUnexpectedTLS = {
      host: 'my.host.com',
      to: ['something@example.com', 'someone@example.com'],
      tlsRejectUnauthorized: 'true', // Any value that is not true or false will log a warning and not be used
    };
    const errors = {
      0: [],
      1: [{ message: 'something bad', stack: 'Error at line 1' }],
    };
    createTransportSpy.mockReturnValueOnce({ sendMail: sendMailMock });
    await expect(sendEmailNotification(notificationInfoTLSFalse, errors, false)).resolves.not.toThrow();
    expect(createTransportSpy).toBeCalledWith({ host: notificationInfoTLSFalse.host, port: notificationInfoTLSFalse.port, tls: { rejectUnauthorized: false } });

    createTransportSpy.mockReturnValueOnce({ sendMail: sendMailMock });
    await expect(sendEmailNotification(notificationInfoTLSTrue, errors, false)).resolves.not.toThrow();
    expect(createTransportSpy).toBeCalledWith({ host: notificationInfoTLSTrue.host, port: notificationInfoTLSTrue.port, tls: { rejectUnauthorized: true } });

    createTransportSpy.mockReturnValueOnce({ sendMail: sendMailMock });
    await expect(sendEmailNotification(notificationInfoNoTLS, errors, false)).resolves.not.toThrow();
    expect(createTransportSpy).toBeCalledWith({ host: notificationInfoNoTLS.host, port: notificationInfoNoTLS.port }); // No tls object set

    createTransportSpy.mockReturnValueOnce({ sendMail: sendMailMock });
    await expect(sendEmailNotification(notificationInfoUnexpectedTLS, errors, false)).resolves.not.toThrow();
    // A warning will be logged and the unexpected value will not be used
    expect(createTransportSpy).toBeCalledWith({ host: notificationInfoUnexpectedTLS.host, port: notificationInfoUnexpectedTLS.port });
  });

  it('should send an email with stack traces if debug flag was used', async () => {
    createTransportSpy.mockReturnValueOnce({ sendMail: sendMailMock });
    const notificationInfo = {
      host: 'my.host.com',
      port: 123,
      to: ['something@example.com', 'someone@example.com'],
      from: 'other@example.com',
    };
    const errors = {
      0: [],
      1: [{ message: 'something bad', stack: 'Error at line 1' }],
      2: [{ message: 'an error', stack: 'Error at line 3' }, { message: 'another error', stack: 'Error at line 4' }],
    };

    await expect(sendEmailNotification(notificationInfo, errors, true)).resolves.not.toThrow();
    expect(createTransportSpy).toBeCalledWith({ host: notificationInfo.host, port: notificationInfo.port });
    expect(sendMailMock).toBeCalled();
    const sendMailMockArgs = sendMailMock.mock.calls[0][0];
    expect(sendMailMockArgs.text).not.toMatch(/run the extraction client using the `--debug`/i);
    expect(sendMailMockArgs.text).toMatch(/Error at line 1/i);
    expect(sendMailMockArgs.text).toMatch(/Error at line 4/i);
  });
});
