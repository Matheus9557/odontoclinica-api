import { authenticate } from "../../../src/middlewares/authMiddleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("authenticate middleware", () => {
  const next = jest.fn();

  const mockResponse = () => {
    const res: any = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when authorization header is missing", () => {
    const req: any = {
      headers: {},
    };

    const res = mockResponse();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Token não fornecido",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error();
    });

    const req: any = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };

    const res = mockResponse();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Token inválido",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should authenticate successfully", () => {
    mockedJwt.verify.mockReturnValue({
      id: "dentist-1",
      role: "dentist",
    } as never);

    const req: any = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res = mockResponse();

    authenticate(req, res, next);

    expect(req.user).toEqual({
      id: "dentist-1",
      role: "dentist",
    });

    expect(next).toHaveBeenCalled();
  });
});