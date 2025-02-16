import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TableInvoiceItem from '@/presentation/components/TableInvoiceItem.vue'
import { getAllInvoices } from '@/services/invoices'

vi.mock('@/services/invoices') // Mock the service

const $t = (key: string) => key // Mock translation function

describe('InvoiceTable.vue', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks() // Clear previous mocks before each test
  })

  it('should render loading state initially', () => {
    const wrapper = mount(TableInvoiceItem, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    expect(wrapper.find('span').text()).toBe('Loading...')
  })

  it('should fetch and display invoices', async () => {
    const invoicesData = [
      {
        id: '1',
        date: '2023-01-01',
        dueDate: '2023-01-15',
        datetime: '2023-01-01T10:00:00Z',
        observations: 'First invoice of the year.',
        anotation: 'Payment received',
        termsConditions: 'Due within 15 days',
        status: 'paid',
        client: {
          id: 'client123',
          name: 'John Doe',
          identification: '1234567890',
          phonePrimary: '+1234567890',
          phoneSecondary: '+1234567890',
          fax: '+1234567890',
          mobile: '+0987654321',
          email: 'johndoe@example.com',
          regime: 'Regular',
          address: {
            address: '123 Elm Street',
            department: 'Sales',
            city: 'New York',
          },
          kindOfPerson: 'individual',
          identificationObject: {
            type: 'NID',
            number: '123456789',
          },
        },
        numberTemplate: {
          id: 'template1',
          prefix: 'INV-',
          number: '0001',
          text: 'Invoice',
          documentType: 'Invoice',
          fullNumber: 'INV-0001',
          formattedNumber: 'Invoice #0001',
        },
        subtotal: 100.0,
        discount: 10.0,
        tax: 15.0,
        total: 105.0,
        totalPaid: 105.0,
        balance: 0.0,
        decimalPrecision: '2',
        warehouse: {
          id: 'warehouse1',
          name: 'Main Warehouse',
        },
        term: 'Net 15',
        barCodeContent: '12345678901234',
        seller: {
          id: 'seller1',
          name: 'Jane Smith',
          identification: '987654321',
          observations: 'No observations',
        },
        priceList: {
          id: 'priceList1',
          name: 'Standard Prices',
        },
        items: [
          {
            name: 'Sample Product',
            description: 'A sample product for testing.',
            price: 50.0,
            discount: 5.0,
            reference: 'prod001',
            quantity: 2,
            id: 'item001',
            productKey: 'SP-001',
            unit: 'pcs',
            total: 90.0,
          },
        ],
        printingTemplate: {
          id: 'template2',
          name: 'Invoice Template 1',
          pageSize: 'A4',
        },
      },
    ]

    vi.mocked(getAllInvoices).mockResolvedValue(invoicesData)

    const wrapper = mount(TableInvoiceItem, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    // Wait for the promise to resolve and component to re-render
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    // Assert: Check if the loading state is removed and table data is rendered
    expect(wrapper.find('table').exists()).toBe(true)
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(1) // ensures we have 2 rows rendered

    // Verify the content of the first row
    expect(rows[0].find('td').text()).toBe('1')
    expect(rows[0].findAll('td')[1].text()).toBe('2023-01-01')
    expect(rows[0].findAll('td')[2].text()).toBe('John Doe')
    expect(rows[0].findAll('td')[3].text()).toBe('Jane Smith')
    expect(rows[0].findAll('td')[4].text()).toBe('2')
    expect(rows[0].findAll('td')[5].text()).toBe('100')
  })

  it('should handle errors when fetching invoices', async () => {
    // Mock the getAllInvoices function to throw an error
    vi.mocked(getAllInvoices).mockRejectedValue(new Error('Failed to fetch'))

    const wrapper = mount(TableInvoiceItem, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    // Wait for the promise to resolve and component to handle error
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // Check if loading state is removed
    expect(wrapper.find('table').exists()).toBe(true)
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(0) // Ensure no rows are rendered on error
  })
})
