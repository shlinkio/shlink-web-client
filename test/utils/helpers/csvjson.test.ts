import { csvToJson, jsonToCsv } from '../../../src/utils/helpers/csvjson';

describe('csvjson', () => {
  const csv = `"foo","bar","baz"
"hello","world","something"
"one","two","three"`;
  const json = [
    { foo: 'hello', bar: 'world', baz: 'something' },
    { foo: 'one', bar: 'two', baz: 'three' },
  ];

  describe('csvToJson', () => {
    it('parses CSVs as expected', async () => {
      expect(await csvToJson(csv)).toEqual(json);
    });
  });

  describe('jsonToCsv', () => {
    it('parses JSON as expected', () => {
      expect(jsonToCsv(json)).toEqual(csv);
    });
  });
});
