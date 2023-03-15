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
import { errorMock404 } from '../__mocks__/errors';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    it('Should have a highlighted bill icon in vertical layout', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH['Bills']);
      const windowIcon = screen.getByTestId('icon-window');
      const mailIcon = screen.getByTestId('icon-mail');
      const disconnectIcon = screen.getByTestId('icon-disconnect');
      await waitFor(() => windowIcon, mailIcon, disconnectIcon);

      //to-do write expect expression
      expect(windowIcon.id).toContain('layout-icon1');
      expect(mailIcon.id).toContain('layout-icon2');
      expect(disconnectIcon.id).toContain('layout-disconnect');
    });

    it('Should have bills ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map(a => new Date(a.innerHTML));
      const antiChrono = (a, b) => new Date(b.date) - new Date(a.date);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });


  describe('when i click on iconEye', () => {
    it('should show bill file', () => {
      const store = null;
      const newBills = new Bills({ document, onNavigate, store, localStorage: window.localStorage });
      const eye = screen.getAllByTestId('icon-eye')[0];
      const handleClickIconEye = jest.fn(newBills.handleClickIconEye(eye));
      const modale = document.getElementById('modaleFile');
      eye.addEventListener('click', handleClickIconEye);
      userEvent.click(eye);

      expect(handleClickIconEye).toHaveBeenCalled();
      expect(modale).toBeTruthy();
    });

    // Integration tests
    it('should have a h1 tag', () => {
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
    it('Should show Loading...', () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText('Loading...')).toBeTruthy();
    });
  });

  describe('When I navigate to NewBill page', () => {
    it(('Should render NewBill page'), () => {
      const pathname = ROUTES_PATH['NewBill'];
      const html = ROUTES({
        pathname
      });
      document.body.innerHTML = html;
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    });
  });
});


describe('When I click New bill button', () => {
  it('Should have New bill page rendered', () => {
    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const newBills = new Bills({
      document,
      onNavigate,
      store
    });
    const handleClickNewBill = jest.fn(() => newBills.handleClickNewBill());
    const button = screen.getByTestId('btn-new-bill');
    button.addEventListener('click', handleClickNewBill);
    userEvent.click(button);

    expect(handleClickNewBill).toHaveBeenCalled();
    expect(screen.getByTestId('form-new-bill')).toBeTruthy();
  });
});

describe('Given I am connected as an employee', () => {
  it('Should have no store, and no bills', () => {
    const newBills = new Bills({ document });
    expect(newBills.getBills()).toBe(undefined);
  });
  it('Should have a store, and have bills and list of bills', async () => {
    const newBills = new Bills({ document, store });
    const billsRetrieved = await newBills.getBills();
    expect(billsRetrieved.length).toBe(4);
  });
});

describe('When I navigate to Bills page', () => {
  it('Should have Bills object instanciated', () => {
    const billsData = BillsUI({ data: bills });
    document.body.innerHTML = billsData;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const newBills = new Bills({ document, onNavigate, store: null });
    expect(newBills.document).toBe(document);
    expect(newBills.onNavigate).toBe(onNavigate);
    expect(newBills.store).toBeDefined();
  });
  it('Should have empty html', () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    document.body.innerHTML = '<div></div>';
    const newBills = new Bills({ document, onNavigate, store: null });
    expect(newBills.document).toBe(document);
    expect(newBills.onNavigate).toBe(onNavigate);
    expect(newBills.store).toBeDefined();
  });

  //with error message
  it('Should show an error message', () => {
    const html = BillsUI({ error: errorMock404 });
    document.body.innerHTML = html;
    const message = screen.getByText(/Erreur 404/);
    expect(message).toBeTruthy();
  });
});

// Test d'integration GET
describe('Given I am a user connected as Employee', () => {
  describe('When I navigate to Bills Page', () => {
    it('Should have bills fetched from the simulated API GET', async () => {
      localStorage.setItem(
        'user',
        JSON.stringify({ type: 'Employee', email: 'a@a' })
      );
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH['Bills']);
      await waitFor(() => screen.getAllByText('Billed'));
      const button = screen.getAllByTestId('icon-disconnect');
      expect(button).toBeTruthy();
    });
  });
});