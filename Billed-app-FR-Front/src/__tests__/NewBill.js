/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */
import {
  screen,
  fireEvent,
} from '@testing-library/dom';

import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import { localStorageMock } from '../__mocks__/localStorage.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    it('Then form should be...', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      expect(screen.getByTestId('form-new-bill')).toBeTruthy();
      expect(screen.getByTestId('expense-type')).toBeTruthy();
      expect(screen.getByTestId('expense-name')).toBeTruthy();
      expect(screen.getByTestId('datepicker')).toBeTruthy();
      expect(screen.getByTestId('amount')).toBeTruthy();
      expect(screen.getByTestId('vat')).toBeTruthy();
      expect(screen.getByTestId('pct')).toBeTruthy();
      expect(screen.getByTestId('commentary')).toBeTruthy();
      expect(screen.getByTestId('file')).toBeTruthy();
      expect(screen.getAllByText('Envoyer')).toBeTruthy();
    }, 30000);
  });
});

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page and I add an image file', () => {
    it('Should be changed in the input', () => {

      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const file = screen.getByTestId('file');
      file.addEventListener('change', handleChangeFile);
      fireEvent.change(file);
      expect(handleChangeFile).toHaveBeenCalled();
      expect(file.type).toBe('file');
    });
  });
});
describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page and I fill the form', () => {
    it('Should submit form', () => {

      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const formNewBill = screen.getByTestId('form-new-bill');
      const file = screen.getByTestId('file');
      formNewBill.addEventListener('click', handleSubmit);
      expect(file.value).not.toBe(null);
    });
  });
});
