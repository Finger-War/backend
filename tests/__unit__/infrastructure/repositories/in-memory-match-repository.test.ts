import { Test } from '@nestjs/testing';

import { Match } from '@/domain/entities/match';

import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';

const makeSut = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [InMemoryMatchRepository],
  }).compile();

  const sut = moduleRef.get<InMemoryMatchRepository>(InMemoryMatchRepository);

  return { sut };
};

describe('In Memory Match Repository', () => {
  describe('add', () => {
    it('Should add a match to the repository', async () => {
      const { sut } = await makeSut();

      const match = { id: '1', players: [] } as Match;

      sut.add(match);

      expect(sut['match']).toContain(match);
    });
  });

  describe('findById', () => {
    it('Should return null if no match is found with the specified id', async () => {
      const { sut } = await makeSut();

      const result = sut.findById('1');

      expect(result).toBeNull();
    });

    it('Should return the match with the specified id', async () => {
      const { sut } = await makeSut();

      const match = { id: '1', players: [] } as Match;

      sut['match'] = [match];

      const result = sut.findById('1');

      expect(result).toBe(match);
    });
  });

  describe('findByPlayerId', () => {
    it('Should return null if no match is found containing the specified player id', async () => {
      const { sut } = await makeSut();

      const result = sut.findByPlayerId('playerOne');

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('Should remove the match from the repository', async () => {
      const { sut } = await makeSut();

      const match = { id: '1', players: [] } as Match;
      sut['match'] = [match];

      sut.remove(match);

      expect(sut['match']).not.toContain(match);
    });
  });
});
