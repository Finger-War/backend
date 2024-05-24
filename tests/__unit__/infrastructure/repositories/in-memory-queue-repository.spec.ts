import { Test } from '@nestjs/testing';

import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';

const makeSut = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [InMemoryQueueRepository],
  }).compile();

  const sut = moduleRef.get<InMemoryQueueRepository>(InMemoryQueueRepository);

  return { sut };
};

describe('In Memory Queue Repository', () => {
  describe('joinQueue', () => {
    it('Should add a player to the queue', async () => {
      const { sut } = await makeSut();

      const playerId = 'player1';

      sut.joinQueue(playerId);

      expect(sut['queue']).toContainEqual({ id: playerId });
    });
  });

  describe('getOutQueue', () => {
    it('Should remove a player from the queue', async () => {
      const { sut } = await makeSut();

      const playerId = 'player1';

      sut.joinQueue(playerId);
      sut.getOutQueue(playerId);

      expect(sut['queue']).not.toContainEqual({ id: playerId });
    });
  });

  describe('getPlayer', () => {
    it('Should return a player if they are in the queue', async () => {
      const { sut } = await makeSut();

      const playerId = 'player1';

      sut.joinQueue(playerId);

      const player = sut.getPlayer(playerId);
      expect(player).toEqual({ id: playerId });
    });

    it('Should return null if the player is not in the queue', async () => {
      const { sut } = await makeSut();

      const playerId = 'player1';

      const player = sut.getPlayer(playerId);
      expect(player).toBeNull();
    });
  });

  describe('tryMatch', () => {
    it('Should return undefined if there are less than two players in the queue', async () => {
      const { sut } = await makeSut();

      const playerId = 'player1';

      sut.joinQueue(playerId);

      const match = sut.tryMatch();
      expect(match).toBeUndefined();
    });

    it('Should return two players if there are at least two players in the queue', async () => {
      const { sut } = await makeSut();

      const playerOneId = 'player1';
      const playerTwoId = 'player2';

      sut.joinQueue(playerOneId);
      sut.joinQueue(playerTwoId);

      const match = sut.tryMatch();
      expect(match).toEqual([{ id: playerOneId }, { id: playerTwoId }]);
    });

    it('Should remove the matched players from the queue', async () => {
      const { sut } = await makeSut();

      const playerOneId = 'player1';
      const playerTwoId = 'player2';
      const playerThreeId = 'player3';

      sut.joinQueue(playerOneId);
      sut.joinQueue(playerTwoId);
      sut.joinQueue(playerThreeId);

      sut.tryMatch();

      const playerOne = sut.getPlayer(playerOneId);
      const playerTwo = sut.getPlayer(playerTwoId);
      const playerThree = sut.getPlayer(playerThreeId);

      expect(playerOne).toBeNull();
      expect(playerTwo).toBeNull();
      expect(playerThree).toEqual({ id: playerThreeId });
    });
  });
});
