import { FieldDefinition, CompositeType } from "@apollo/core";

/**
 * The type of query graphs edge "transitions".
 *
 * An edge transition encodes what the edges correspond to, in the underlying graphQL
 * schema. Edges may correspond to:
 *  - a field (`FieldCollection`): the edge goes from (a vertex for) the field parent type, to the 
 *    field (base) type. 
 *  - a "downcast" (`DownCast`): the edges goes from an abstract type (interface or union) to a type
 *    that implements that abstract type (for interfaces) or is a member of that abstract type (for
 *    unions).
 *  - a key (`KeyResolution`), only found in "federated" query graphs: the edge goes from an
 *    entity type in a particular subgraph to the same entity type but in another subgraph. Edge
  *   with key transition _must_ have `conditions` corresponding to the key fields.
  * - a "free" edge: this is a special case only used for the edges out of the root vertices of
  *   "federated" query graphs. It does not correspond to any physical graphQL elements but
  *   can be understood as the fact that the gateway is always free to start querying any of
  *   the subgraph services as needed.
  *
 */
export type Transition = FieldCollection | DownCast | KeyResolution | FreeTransition;

export class KeyResolution {
  readonly kind = 'KeyResolution' as const;
  readonly collectOperationElements = false as const;

  constructor() {
  }

  toString() {
    return 'key()';
  }
}

export class FieldCollection {
  readonly kind = 'FieldCollection' as const;
  readonly collectOperationElements = true as const;

  constructor(readonly definition: FieldDefinition<any>) {}

  toString() {
    return this.definition.name;
  }
}

export class DownCast {
  readonly kind = 'DownCast' as const;
  readonly collectOperationElements = true as const;

  constructor(readonly sourceType: CompositeType, readonly castedType: CompositeType) {}

  toString() {
    return '... on ' + this.castedType.name;
  }
}

export class FreeTransition {
  readonly kind = 'FreeTransition' as const;
  readonly collectOperationElements = false as const;

  toString() {
    return '∅';
  }
}

export const freeTransition = new FreeTransition();

