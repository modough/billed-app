/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */
import {
  screen,
  fireEvent,
} from '@testing-library/dom';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store.js';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee'
}));
const onNavigate = jest.fn();

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
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const formNewBill = screen.getByTestId('form-new-bill');
      const file = screen.getByTestId('file');
      const newCreatedBill = {
        type: 'Transports',
        name: 'validBill',
        date: '2022-07-01',
        amount: 50,
        vat: 70,
        pct: 20,
        fileUrl: 'https://localhost:3456/images/test.jpg',
        fileName: 'test.jpg'
      };
      screen.getByTestId('expense-type').value = newCreatedBill.type;
      screen.getByTestId('datepicker').value = newCreatedBill.date;
      screen.getByTestId('expense-name').value = newCreatedBill.name;
      screen.getByTestId('amount').value = newCreatedBill.amount;
      screen.getByTestId('vat').value = newCreatedBill.vat;
      screen.getByTestId('pct').value = newCreatedBill.pct;
      screen.getByTestId('commentary').value = newCreatedBill.commentary;
      newBill.fileUrl = newCreatedBill.fileUrl;
      newBill.fileName = newCreatedBill.fileName;

      formNewBill.addEventListener('submit', handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
      expect(file.value).not.toBe(null);
    });
  });
});
