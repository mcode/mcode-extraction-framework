const moment = require('moment');
const { formatDate, formatDateTime } = require('../../src/helpers/dateUtils');

test('formatDate reformats date', () => {
  expect(formatDate('04/12/19')).toEqual('2019-04-12');
  expect(formatDate('2019-04-12T18:00:00')).toEqual('2019-04-12');
});

test('formatDate does not reformat invalid date', () => {
  expect(formatDate('102/30/19')).toEqual('102/30/19');
});

test('formatDateTime reformats date with a time if provided', () => {
  const currentTimeZone = moment().format('Z');
  expect(formatDateTime('04/12/19')).toEqual('2019-04-12');
  expect(formatDateTime('2019-04-12T08:00:00')).toEqual(`2019-04-12T08:00:00${currentTimeZone}`);
});

test('formatDateTime does not reformat invalid date', () => {
  expect(formatDateTime('2019-104-12T18:00:00')).toEqual('2019-104-12T18:00:00');
});
