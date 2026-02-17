# Test Build Configuration
# Compiles tests for mock hardware testing

cmake_minimum_required(VERSION 3.16)

# Test executable
add_executable(test_runner
    test_runner.c
    mock_hardware.c
    test_bsp.c
    test_audio.c
    test_lora.c
    test_buttons.c
    test_display.c
)

# Include directories
target_include_directories(test_runner PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/..
)

# Compiler flags
target_compile_options(test_runner PRIVATE
    -Wall
    -Wextra
    -Werror
    -std=c11
)

# Link libraries (minimal for testing)
target_link_libraries(test_runner PRIVATE
    m  # Math library
)

# Enable testing
enable_testing()
add_test(NAME NodeOneMockTests COMMAND test_runner)
