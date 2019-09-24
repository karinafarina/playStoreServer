const supertest = require('supertest');
const app = require('../app');
const playStore = require('../playStoreData.js');
const { expect } = require('chai');

describe('Get /apps', () => {
  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.keys('App', 'Category', 'Rating', 'Genres'
        );
      });
  });
  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Mistake' })
      .expect(400, 'Sort must be one of rating or app');
  });
  it('should sort by app', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'app' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (appAtIPlus1.App < appAtI.App) {
            // the books were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should sort by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const ratingAtI = res.body[i];
          const ratingAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (ratingAtIPlus1.Rating < ratingAtI.Rating) {
            // the books were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should be 400 if genre is incorrect', () => {
    let values = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcat', 'Card'];
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Mistake' })
      .expect(400, `Genre must be one of ${values}`);
  });
 it('should filter by genre', () => {
  let values = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcat', 'Card'];
  let titles = playStore.map(title => title.App);
  console.log('the titles are : ', titles);
    return supertest(app)
      .get('/apps')
      .query({ genre: values })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        expect(res.body.titles).to.only.include('Helix Jump', 'Kick the Buddy', 'Temple Run 2', 'Zombie Hunter King', 'slither.io')
      });
  });
});
