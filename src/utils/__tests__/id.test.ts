import ID from '../id';

describe('ID', () => {
  it('should generate ID', () => {
    const value = ID.generate();

    expect(value).toBeDefined();
    expect(typeof value).toBe('string');
  });

  it('should generate ID with default length', () => {
    const value = ID.generate();

    expect(value).toBeDefined();
    expect(value.length).toBe(ID.ID_LENGTH_DEFAULT);
  });

  it('should generate ID with minimum length', () => {
    const value = ID.generate(ID.ID_LENGTH_MINIMUM);

    expect(value.length).toBe(ID.ID_LENGTH_MINIMUM);
  });

  it('should generate ID with maximum length', () => {
    const value = ID.generate(ID.ID_LENGTH_MAXIMUM);

    expect(value.length).toBe(ID.ID_LENGTH_MAXIMUM);
  });

  it('should generate ID with default when invalid length specified', () => {
    let value = ID.generate(ID.ID_LENGTH_MINIMUM - 1);

    expect(value.length).toBe(ID.ID_LENGTH_DEFAULT);

    value = ID.generate(ID.ID_LENGTH_MAXIMUM + 1);

    expect(value.length).toBe(ID.ID_LENGTH_DEFAULT);
  });
});
