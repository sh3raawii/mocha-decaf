describe('test suite', async () => {
  before(() => {
    throw new Error('BeforeAll hook was triggered')
  })

  beforeEach(() => {
    throw new Error('BeforeEach hook was triggered')
  })

  afterEach(() => {
    throw new Error('AfterEach hook was triggered')
  })

  after(() => {
    throw new Error('AfterAll hook was triggered')
  })

  it('test case', async () => {
    throw new Error('test case body was executed')
  })
})
