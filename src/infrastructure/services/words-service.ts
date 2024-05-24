import { Injectable } from '@nestjs/common';

interface IWordsService {
  generateRandomWord(): Promise<string[]>;
}

@Injectable()
export class WordsService implements IWordsService {
  baseUrl = 'https://pt.wikipedia.org';

  async generateRandomWord(): Promise<string[]> {
    const randomSummary = await fetch(
      `${this.baseUrl}/api/rest_v1/page/random/summary`,
    ).then((response) => response.json());

    const { pageid } = randomSummary;

    const randomWords = await fetch(
      `${this.baseUrl}/w/api.php?action=query&format=json&pageids=${pageid}&prop=extracts&exintro=true&origin=*`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((response) => response.json());

    const text = randomWords.query.pages[pageid].extract;

    const textInOneParagraph = text.replace(/<\/p><p>+/g, ' ');

    const textWithoutReferenceLinks = textInOneParagraph.replace(
      /\[\d+\]/gi,
      '',
    );

    const textWithoutInvisibleCharacteres = textWithoutReferenceLinks.replace(
      /[\u200B-\u200D\uFEFF]/g,
      '',
    );

    const textWithoutWhiteSpace = textWithoutInvisibleCharacteres.replace(
      /\s+/g,
      ' ',
    );

    const textTrimmed = textWithoutWhiteSpace.trim();

    const array = textTrimmed.split(' ');

    const words = Array.from(
      { length: 10 },
      () => array[Math.floor(Math.random() * array.length)],
    );

    return words;
  }
}
