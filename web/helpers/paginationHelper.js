import { NEXT_PRODUCTS_QUERY, PREVIOUS_PRODUCTS_QUERY, PRODUCTS_QUERY } from "../Graphql/product.graphql.js";

export const paginationHelper = (before, after, limit) => {
  let query = PRODUCTS_QUERY;
  let variables = {
    first: Number(limit),
  };
  if (before !== '' && after === '') {
    query = PREVIOUS_PRODUCTS_QUERY;
    variables.before = before;
    variables.last = Number(limit);
  }
  if (before === '' && after !== '') {
    query = NEXT_PRODUCTS_QUERY;
    variables.after = after;
  }
  if (before !== 'null') {
    query = PREVIOUS_PRODUCTS_QUERY;
    variables.before = before;
    variables.last = Number(limit);
  }
  if (after !== 'null') {
    query = NEXT_PRODUCTS_QUERY;
    variables.after = after;
  }
  return { variables, query };
};