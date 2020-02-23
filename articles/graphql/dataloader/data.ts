const articles = [
  { id: 1, title: 'Article 1', authorId: 1 },
  { id: 2, title: 'Article 2', authorId: 7 },
  { id: 3, title: 'Article 3', authorId: 6 },
  { id: 4, title: 'Article 4', authorId: 3 },
  { id: 5, title: 'Article 5', authorId: 4 },
  { id: 6, title: 'Article 6', authorId: 5 },
  { id: 7, title: 'Article 7', authorId: 6 },
  { id: 8, title: 'Article 8', authorId: 7 },
  { id: 9, title: 'Article 9', authorId: 3 },
  { id: 10, title: 'Article 10', authorId: 2 },
  { id: 11, title: 'Article 11', authorId: 5 },
  { id: 12, title: 'Article 12', authorId: 4 },
  { id: 13, title: 'Article 13', authorId: 2 },
  { id: 14, title: 'Article 14', authorId: 1 },
  { id: 15, title: 'Article 15', authorId: 1 },
];

const authors = [
  { id: 1, name: 'User 1', email: '1@example.com' },
  { id: 2, name: 'User 2', email: '2@example.com' },
  { id: 3, name: 'User 3', email: '3@example.com' },
  { id: 4, name: 'User 4', email: '4@example.com' },
  { id: 5, name: 'User 5', email: '5@example.com' },
  { id: 6, name: 'User 6', email: '6@example.com' },
  { id: 7, name: 'User 7', email: '7@example.com' },
];

function createModel(data: Array<Record<string, any>>, modelName: string) {
  return class MockDB {
    static findById(id: number) {
      this.log(`findById(${id})`);
      return data.find((o) => o.id === id);
    }

    static findByIds(ids: Array<number>): any {
      this.log(`findByIds(${ids.join(', ')})`);
      return data.filter((o) => ids.includes(o.id));
    }

    static findMany() {
      this.log(`findMany()`);
      return data;
    }

    static debug = true;
    static log(msg: string) {
      if (this.debug) {
        console.log(`Run ${modelName} query: ${msg}`);
      }
    }
  };
}

const articleModel = createModel(articles, 'Article');
const authorModel = createModel(authors, 'Author');

export { articleModel, authorModel };
