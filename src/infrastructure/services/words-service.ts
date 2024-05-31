import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';

interface IWordsService {
  generateRandomWords(): Promise<string[]>;
}

@Injectable()
export class WordsService implements IWordsService {
  private readonly baseUrl = 'https://pt.wikipedia.org';

  constructor(private readonly httpService: HttpService) {}

  async generateRandomWords(): Promise<string[]> {
    const randomSummary = await this.fetchRandomSummary();
    const pageid = randomSummary.pageid;

    const randomWords = await this.fetchRandomWords(pageid);
    const text = randomWords.query.pages[pageid].extract;

    return this.extractRandomWords(text, 10);
  }

  private async fetchRandomSummary(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/api/rest_v1/page/random/summary`),
    );

    return data;
  }

  private async fetchRandomWords(pageid: number): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/w/api.php?action=query&format=json&pageids=${pageid}&prop=extracts&exintro=true&origin=*`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return data;
  }

  private extractRandomWords(text: string, count: number): string[] {
    const textInOneParagraph = text.replace(/<\/p><p>+/g, ' ');
    const textWithoutReferenceLinks = textInOneParagraph.replace(
      /\[\d+\]/gi,
      '',
    );
    const textWithoutInvisibleCharacters = textWithoutReferenceLinks.replace(
      /[\u200B-\u200D\uFEFF]/g,
      '',
    );
    const textWithoutWhiteSpace = textWithoutInvisibleCharacters.replace(
      /\s+/g,
      ' ',
    );
    const textTrimmed = textWithoutWhiteSpace.trim();
    const array = textTrimmed.split(' ');

    return Array.from(
      { length: count },
      () => array[Math.floor(Math.random() * array.length)],
    );
  }
}
