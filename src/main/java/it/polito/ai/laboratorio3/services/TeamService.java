package it.polito.ai.laboratorio3.services;

import it.polito.ai.laboratorio3.dtos.CourseDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.dtos.TeamDTO;
import it.polito.ai.laboratorio3.entities.Token;
import org.springframework.security.access.prepost.PreAuthorize;

import java.io.Reader;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface TeamService {
    static final int ATTIVO=1;
    static final int NON_ATTIVO=0;

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    boolean addCourse(CourseDTO course);

    Optional<CourseDTO> getCourse(String name);
    List<CourseDTO> getAllCourses();
    boolean addStudent(StudentDTO student);
    Optional<StudentDTO> getStudent(String studentId);
    List<StudentDTO> getAllStudents();
    List<StudentDTO> getEnrolledStudents(String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    boolean addStudentToCourse(String studentId, String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void enableCourse(String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void disableCourse(String courseName);

    List<Boolean> addAll(List<StudentDTO> students);
    List<Boolean> enrollAll(List<String> studentIds, String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    List<Boolean> addAndEroll(Reader r, String courseName);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<CourseDTO> getCourses(String studentId);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<TeamDTO> getTeamsForStudent(String studentId);
    List<StudentDTO>getMembers(Long TeamId);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    TeamDTO proposeTeam(String courseId, String name, List<String> memberIds);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<TeamDTO> getTeamForCourse(String courseName);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<StudentDTO> getStudentsInTeams(String courseName);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<StudentDTO> getAvailableStudents(String courseName);

    void activeTeam(Long teamId);
    void evictTeam(Long teamId);
}
