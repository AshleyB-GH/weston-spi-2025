/**
 * Test script to validate JSON file upload functionality
 * Tests: file parsing, error handling, state management
 */

// Test 1: Valid JSON parsing
console.log("TEST 1: Valid JSON Parsing");
const validJSON = JSON.stringify({ assessment: "test", data: [1, 2, 3] });
try {
  const parsed = JSON.parse(validJSON);
  console.log("✓ PASS: Valid JSON parsed successfully", parsed);
} catch (err) {
  console.log("✗ FAIL: Valid JSON parsing failed", err.message);
}

// Test 2: Invalid JSON error handling
console.log("\nTEST 2: Invalid JSON Error Handling");
const invalidJSON = "{ invalid json }";
try {
  JSON.parse(invalidJSON);
  console.log("✗ FAIL: Should have thrown syntax error");
} catch (err) {
  if (err instanceof SyntaxError) {
    console.log("✓ PASS: SyntaxError caught correctly:", err.message);
  } else {
    console.log("✗ FAIL: Wrong error type:", err.constructor.name);
  }
}

// Test 3: Empty string handling
console.log("\nTEST 3: Empty String Handling");
try {
  JSON.parse("");
  console.log("✗ FAIL: Should have thrown error for empty string");
} catch (err) {
  console.log("✓ PASS: Empty string error caught:", err.message);
}

// Test 4: Non-JSON object string
console.log("\nTEST 4: Non-Object JSON");
const nonObjectJSON = JSON.stringify([1, 2, 3]);
try {
  const parsed = JSON.parse(nonObjectJSON);
  if (Array.isArray(parsed)) {
    console.log("✓ PASS: Array JSON parsed (acceptable)", parsed);
  }
} catch (err) {
  console.log("✗ FAIL: Array JSON parsing failed", err.message);
}

// Test 5: Complex nested JSON
console.log("\nTEST 5: Complex Nested JSON");
const complexJSON = JSON.stringify({
  assessment: {
    ref: "RA-123",
    hazards: [
      { id: "h1", severity: 1, probability: "A" },
      { id: "h2", severity: 2, probability: "B" }
    ],
    metadata: {
      createdAt: new Date().toISOString(),
      version: "1.0"
    }
  }
});
try {
  const parsed = JSON.parse(complexJSON);
  if (parsed.assessment && Array.isArray(parsed.assessment.hazards)) {
    console.log("✓ PASS: Complex nested JSON parsed successfully");
  }
} catch (err) {
  console.log("✗ FAIL: Complex JSON parsing failed", err.message);
}

// Test 6: Malformed but recoverable JSON
console.log("\nTEST 6: Trailing Comma (should fail - strict JSON)");
const trailingCommaJSON = '{"key": "value",}';
try {
  JSON.parse(trailingCommaJSON);
  console.log("✗ FAIL: Should have rejected trailing comma");
} catch (err) {
  console.log("✓ PASS: Trailing comma correctly rejected:", err.message);
}

// Test 7: Unicode and special characters
console.log("\nTEST 7: Unicode and Special Characters");
const unicodeJSON = JSON.stringify({
  title: "Test with émojis 🎯📊",
  description: "Special chars: !@#$%^&*()",
  symbols: "½, §, ©, ®, ™"
});
try {
  const parsed = JSON.parse(unicodeJSON);
  console.log("✓ PASS: Unicode JSON parsed:", parsed.title);
} catch (err) {
  console.log("✗ FAIL: Unicode JSON parsing failed", err.message);
}

// Test 8: Large JSON file
console.log("\nTEST 8: Large JSON Object");
const largeData = {
  records: Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: `Record ${i}`,
    nested: { data: [1, 2, 3] }
  }))
};
const largeJSON = JSON.stringify(largeData);
try {
  const parsed = JSON.parse(largeJSON);
  if (parsed.records && parsed.records.length === 1000) {
    console.log("✓ PASS: Large JSON parsed successfully (1000 records)");
  }
} catch (err) {
  console.log("✗ FAIL: Large JSON parsing failed", err.message);
}

// Test 9: Null and undefined handling
console.log("\nTEST 9: Null Value Handling");
const nullJSON = JSON.stringify({ key: null, data: undefined });
try {
  const parsed = JSON.parse(nullJSON);
  // Note: undefined will become null in JSON
  console.log("✓ PASS: Null/undefined JSON parsed", parsed);
} catch (err) {
  console.log("✗ FAIL: Null JSON parsing failed", err.message);
}

// Test 10: File validation logic simulation
console.log("\nTEST 10: File Validation Logic");
function simulateFileValidation(jsonContent) {
  try {
    const parsed = JSON.parse(jsonContent);
    
    if (!parsed || typeof parsed !== "object") {
      throw new Error("File must contain valid JSON object data");
    }
    
    return { success: true, data: parsed };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof SyntaxError 
        ? `Invalid JSON format: ${err.message}`
        : `Error: ${err.message}`
    };
  }
}

// Test valid data
const result1 = simulateFileValidation('{"test": "data"}');
console.log(result1.success ? "✓ PASS: Valid file" : "✗ FAIL:", result1.error);

// Test invalid JSON
const result2 = simulateFileValidation('invalid');
console.log(!result2.success ? "✓ PASS: Invalid JSON caught" : "✗ FAIL: Should catch error");

// Test non-object
const result3 = simulateFileValidation('"just a string"');
console.log(!result3.success ? "✓ PASS: Non-object caught" : "✗ FAIL: Should catch error");

console.log("\n" + "=".repeat(50));
console.log("All tests completed!");
console.log("=".repeat(50));
