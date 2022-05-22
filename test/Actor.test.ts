import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon, { SinonMock, SinonStub } from 'sinon';
import { Pool } from 'pg'
import { actor } from '../db';

chai.use(chaiAsPromised);

class ClientMock {query() {} release() {}}

describe('Actor', () => {
  let query: SinonStub;
  let connect: SinonStub;
  let client: SinonMock;

  beforeEach(() => {
    query = sinon.stub(Pool.prototype, 'query');
    connect = sinon.stub(Pool.prototype, 'connect');
    client = sinon.mock(ClientMock.prototype);
  })

  afterEach(() => {
    query.restore();
    connect.restore();
    client.restore();
  })

  it('findByYearAndLastName', async () => {
    query.resolves({
      rows: [{}]
    });

    const result = await actor.findByYearAndLastName(0, '');

    expect(result.length).to.equal(1);
  })

  it('updateLastNameByIds#commit', async () => {
    client.expects('release').once();
    client.expects('query').exactly(4).resolves({
      rowCount: 1
    });
    connect.resolves(new ClientMock());

    const count = await actor.updateLastNameByIds('', [0, 0]);

    client.verify();
    expect(count).to.equal(2);
  })

  it('updateLastNameByIds#rollback', async () => {
    client.expects('release').once();
    client.expects('query').twice().rejects()
      .onSecondCall().resolves();
    connect.resolves(new ClientMock());

    await expect(actor.updateLastNameByIds('', [0, 0]))
      .to.eventually.be.rejected;

    client.verify();
  })

  it('updateFirstNameByIds', async () => {
    query.resolves({
      rowCount: 2
    });

    const count = await actor.updateFirstNameByIds('', [0, 0]);

    expect(count).to.equal(2);
  })
})
