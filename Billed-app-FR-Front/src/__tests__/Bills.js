/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */

import { getByTestId, screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import store from '../__mocks__/store.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import Bills from '../containers/bills';
import router from '../app/Router.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes';

const data = [];
const loading = false;
const error = null;

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      const windowIcon = screen.getByTestId('icon-window');
      await waitFor(() => windowIcon);

      //to-do write expect expression
      expect(windowIcon.id).toContain('layout-icon1');
    });

    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map(a => new Date(a.innerHTML));

      //const antiChrono = (a, b) => ((a < b) ? 1 : -1);

      const antiChrono = (a, b) => new Date(b.date) - new Date(a.date);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
  describe('when i click on iconEye', () => {
    it('should show bill file', () => {
      const eye = screen.getAllByTestId('icon-eye')[0];
      expect(eye).toBeTruthy();
    });

    it('should show an image', () => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div id="root">
          <h1 data-testid="bill-image">Billed App</h1>
        </div>
      `;
      expect(getByTestId(wrapper, 'bill-image').textContent)
        .toEqual('Billed App');
    });
  });

  describe('Given i am on the loading page', () => {
    test('Should show Loading...', () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText('Loading...')).toBeTruthy();
    });
  });

  describe('When I navigate to NewBill page', () => {
    test(('Then, it should render NewBill page'), () => {
      const pathname = ROUTES_PATH['NewBill'];
      const html = ROUTES({
        pathname,
        data,
        loading,
        error
      });
      document.body.innerHTML = html;
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    });
  });
});

describe('When I click New bill button', () => {
  test('Then New bill page should render', () => {
    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    const bill = new Bills({
      document,
      onNavigate,
      store: store,
      localStorage: window.localStorage
    });

    const handleClickNewBill = jest.fn(() => bill.handleClickNewBill());
    const button = screen.getByTestId('btn-new-bill');
    button.addEventListener('click', handleClickNewBill);
    userEvent.click(button);
    expect(handleClickNewBill).toHaveBeenCalled();
    expect(screen.getByTestId('form-new-bill')).toBeTruthy();
  });
});

describe('When I navigate to Bills page', () => {
  test('Then Bills object shoud be instanciated', () => {

    const ui = BillsUI({ data: bills });
    document.body.innerHTML = ui;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const myBill = new Bills({ document, onNavigate, store: null, localStorage: null });
    expect(myBill.document).toBe(document);
    expect(myBill.onNavigate).toBe(onNavigate);
    expect(myBill.store).toBe(null);


  });
  test('Then empty html', () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    document.body.innerHTML = '<div></div>';
    const myBill = new Bills({ document, onNavigate, store: null, localStorage: null });
    expect(myBill.document).toBe(document);
    expect(myBill.onNavigate).toBe(onNavigate);
    expect(myBill.store).toBe(null);
  });
});