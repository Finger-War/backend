import { Test } from '@nestjs/testing';

import { Match } from '@/domain/entities/match';

import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';

describe('In Memory Match Repository', () => {
  let repository: InMemoryMatchRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [InMemoryMatchRepository],
    }).compile();

    repository = moduleRef.get<InMemoryMatchRepository>(
      InMemoryMatchRepository,
    );
  });

  describe('add', () => {
    it('Should add a match to the repository', () => {
      const match = { id: '1', players: [] } as Match;

      repository.add(match);

      expect(repository['match']).toContain(match);
    });
  });

  describe('findById', () => {
    it('Should return null if no match is found with the specified id', () => {
      const result = repository.findById('1');

      expect(result).toBeNull();
    });

    it('Should return the match with the specified id', () => {
      const match = { id: '1', players: [] } as Match;
      repository['match'] = [match];

      const result = repository.findById('1');

      expect(result).toBe(match);
    });
  });
});
