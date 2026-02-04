import { z } from "zod";

// Common dimension constraints
const DIMENSION_MIN = 0.001;
const DIMENSION_MAX = 100000;
const WEIGHT_MAX = 1000000;
const QUANTITY_MAX = 10000;
const ARRAY_MAX_LENGTH = 1000;

// Dimension schema (positive number with reasonable bounds)
const dimension = z.number().min(DIMENSION_MIN).max(DIMENSION_MAX);
const weight = z.number().min(0).max(WEIGHT_MAX).optional();
const quantity = z.number().int().min(1).max(QUANTITY_MAX).optional();

// Bin type enum (matches ContainerType from @cratefit/pack)
const binType = z
  .enum(["box", "pallet", "container", "truck", "shelf", "custom"])
  .default("box");

// Bin specification schema
export const binSpecSchema = z.object({
  id: z.string().min(1).max(256),
  type: binType,
  width: dimension,
  height: dimension,
  depth: dimension,
  maxWeight: weight,
  quantity: quantity,
});

// Item specification schema
export const itemSpecSchema = z.object({
  id: z.string().min(1).max(256),
  width: dimension,
  height: dimension,
  depth: dimension,
  weight: weight,
  quantity: quantity,
  allowRotation: z.boolean().optional(),
  stackable: z.boolean().optional(),
  maxStackWeight: weight,
  priority: z.number().int().min(0).max(1000).optional(),
  color: z.string().max(64).optional(),
  groupId: z.string().max(256).optional(),
});

// Pack options schema (matches PackOptions from @cratefit/pack)
export const packOptionsSchema = z
  .object({
    algorithm: z
      .enum(["extreme-point", "layer-building", "wall-building", "eb-afit"])
      .optional(),
    sortItems: z.boolean().optional(),
    sortBins: z.boolean().optional(),
    timeout: z.number().int().min(100).max(60000).optional(),
    maxIterations: z.number().int().min(1).max(100000).optional(),
  })
  .optional();

// Main pack request schema
export const packRequestSchema = z.object({
  bins: z.array(binSpecSchema).min(1).max(ARRAY_MAX_LENGTH),
  items: z.array(itemSpecSchema).min(1).max(ARRAY_MAX_LENGTH),
  options: packOptionsSchema,
});

// Online packing schemas
export const startRequestSchema = z.object({
  bin: binSpecSchema,
});

export const placeRequestSchema = z.object({
  sessionId: z.string().uuid(),
  item: itemSpecSchema,
});

export const resetRequestSchema = z.object({
  sessionId: z.string().uuid(),
});

export const stateQuerySchema = z.object({
  sessionId: z.string().uuid(),
});

// Type exports
export type PackRequest = z.infer<typeof packRequestSchema>;
export type StartRequest = z.infer<typeof startRequestSchema>;
export type PlaceRequest = z.infer<typeof placeRequestSchema>;
export type ResetRequest = z.infer<typeof resetRequestSchema>;
export type StateQuery = z.infer<typeof stateQuerySchema>;
